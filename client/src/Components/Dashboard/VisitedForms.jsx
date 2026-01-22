import { List } from "antd";

const dummyVisitedForms = [
  {
    id: "1",
    title: "User Registration Form",
    lastVisitedAt: "2026-01-20"
  },
  {
    id: "2",
    title: "Course Enrollment",
    lastVisitedAt: "2026-01-19"
  }
];

export default function VisitedForms() {
  return (
    <List
      bordered
      dataSource={dummyVisitedForms}
      renderItem={(item) => (
        <List.Item>
          <strong>{item.title}</strong>
          <span style={{ marginLeft: "auto", color: "#888" }}>
            Last visited: {item.lastVisitedAt}
          </span>
        </List.Item>
      )}
    />
  );
}
