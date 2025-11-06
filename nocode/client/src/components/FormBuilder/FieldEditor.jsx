// src/components/FormBuilder/FieldEditor.jsx
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function FieldEditor({ fields, setFields, onAdd }) {
  const addField = (type) => {
    const id = Date.now().toString();
    const newField = {
      id,
      type,
      label: `${type[0].toUpperCase() + type.slice(1)} Field`,
      required: false,
      placeholder: "",
      options:
        type === "dropdown" || type === "checkbox" || type === "radio"
          ? ["Option 1", "Option 2"]
          : [],
    };
    onAdd(newField);
  };

  // Handle drag-and-drop reorder
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(fields);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setFields(items);
  };

  const updateField = (id, key, value) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold mb-3">🧱 Form Fields</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {["text", "textarea", "dropdown", "checkbox", "radio"].map((t) => (
          <button
            key={t}
            onClick={() => addField(t)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            + {t}
          </button>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((f, idx) => (
                <Draggable key={f.id} draggableId={f.id} index={idx}>
                  {(provided) => (
                    <div
                      className="p-3 mb-2 border rounded bg-gray-50"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <label className="block font-semibold">
                        {f.label} ({f.type})
                      </label>
                      <input
                        value={f.label}
                        onChange={(e) =>
                          updateField(f.id, "label", e.target.value)
                        }
                        className="border p-1 mt-1 w-full rounded"
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
