import { useState } from "react";
import Input from "../customElements/Input";
import Button from "../customElements/PrimaryButton";
import Select from "../customElements/Select";

interface TaskCreationProps {
  day: string;
}

export default function TaskCreation({ day }: TaskCreationProps) {
  const [text, setText] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

  return (
      <div 
      className="lg:w-[40%] bg-[#1F1F1F] rounded-md p-4 flex flex-col items-center"
      onClick={(e)=>e.stopPropagation()}
      >
        <h3 className="text-[20px] font-medium mb-4">Create a task for {day}</h3>
        <Input 
        placeholder="Task text" 
        onChange={(e) => setText(e.target.value)} 
        value={text}
        />
        <Select
          options={[
            { value: "high", label: "High priority" },
            { value: "medium", label: "Medium priority" },
            { value: "optional", label: "Optional priority" },
          ]}
          value={priority}
          onChange={(value) => setPriority(value)}
          className="mt-2"
        />
        <Button children="Create task" className="mt-4" />
      </div>
    
  );
}
