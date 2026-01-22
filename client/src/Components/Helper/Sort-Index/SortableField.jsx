import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { MenuOutlined } from "@ant-design/icons";

const SortableField = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab mt-2 text-gray-400"
        >
          <MenuOutlined />
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default SortableField;