import express from 'express';
import FormSchema from '../schemas/Form-schemas/Form/Form.schema.js';
import { validateFormPayload} from '../helper/Form-Validator/formValidator.js';
import { normalizeFormPayload } from '../helper/Normalize-Payload/normalizePayload.js';
import DynamicSubmission from '../schemas/Response-schema/User-Response-Submission/response.submission.schema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../schemas/User-Schemas/user.schema.js';
import isAuthenticated from '../Auth/isAuthenicated.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API is working');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: "1d" });

    console.log("Generated Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      success:true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/auth/me" , isAuthenticated, (req, res) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "Log in Again" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: "User authenticated", user: decoded });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "none"
  });
  return  res.status(200).json({ message: "Logout successful" });
});

router.post('/forms', async (req, res) => {
  try {
    validateFormPayload(req.body);
    const formData = normalizeFormPayload(req.body);

    const newForm = new FormSchema(formData);
    const path = `/forms/${newForm._id}`
    newForm.path = path;
  
    await newForm.save();
    // console.log('Received form data:', formData);
    
    return res.status(200).json({ message: 'Form data received successfully', success:true, data: formData });
  } catch (error) {
    console.log(error.message);
    
  }
})

router.get('/user/forms/:id', async (req, res) => {
  try {
    const validUserId = mongoose.Types.ObjectId.isValid(req.params.id)
      ? new mongoose.Types.ObjectId(req.params.id)
      : new mongoose.Types.ObjectId();

    const forms =  await FormSchema.find({createdBy: validUserId}).populate("createdBy");
    return res.status(200).json({ message: 'Forms fetched successfully', success:true, data: forms });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal Server Error', success:false });
  }
});

router.get('/forms/:id', async (req, res) => {
  try {
    const form = await FormSchema.findById(req.params.id).populate("createdBy");
    if (!form) {
      return res.status(404).json({ message: 'Form not found', success:false });
    }
    return res.status(200).json({ message: 'Form fetched successfully', success:true, data: form });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal Server Error', success:false });
  }
});

router.put('/forms/:id', async (req, res) => {
  try {
    validateFormPayload(req.body);
    const formData = normalizeFormPayload(req.body);
    const updatedForm = await FormSchema.findByIdAndUpdate(req.params.id, formData, { new: true }).populate("createdBy");
    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found', success:false });
    }
    return res.status(200).json({ message: 'Form updated successfully', success:true, data: updatedForm });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal Server Error', success:false });
  }
});

router.post("/responses", async (req, res) => {
  try {
    const { formId, submittedBy, responses, meta } = req.body;
    const validUserId = mongoose.Types.ObjectId.isValid(submittedBy)
      ? new mongoose.Types.ObjectId(submittedBy)
      : new mongoose.Types.ObjectId();

    if (!formId || !Array.isArray(responses)) {
      return res.status(400).json({
        message: "Invalid payload",
        success: false
      });
    }

    const newSubmission = new DynamicSubmission({
      formId,
      submittedBy: validUserId,
      responses: responses.map(r => ({
        fieldId: r.fieldId,
        label: r.label,
        value: r.value
      })),
      meta
    });

    await newSubmission.save();

    return res.status(201).json({
      message: "Form response received successfully",
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
});


router.get("/form/responses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user id",
        success: false
      });
    }

    const userId = new mongoose.Types.ObjectId(id);

    const forms = await FormSchema.find({ createdBy: userId }).select("_id");

    if (!forms.length) {
      return res.status(404).json({
        message: "No forms found for this user",
        success: false
      });
    }

    const formIds = forms.map(f => f._id);

    const submissions = await DynamicSubmission.find({
      formId: { $in: formIds }
    })
      .populate("formId", "title createdBy")
      .populate("submittedBy", "name email");

    return res.status(200).json({
      message: "Form responses fetched successfully",
      success: true,
      data: submissions
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
});


const indexrouter = router;
export default indexrouter;