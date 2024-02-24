"use client";

import * as React from "react";
import { RxArrowUp } from "react-icons/rx";
import Textarea from "react-textarea-autosize";

import { useEnterSubmit } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

export interface PromptProps {
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
}

export default function PromptFrom({ onSubmit, isLoading }: PromptProps) {
  const [input, setInput] = React.useState<string>();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        await onSubmit(input);
      }}
      ref={formRef}
    >
      <div className="bg-[#292929] relative flex max-h-50 w-full grow flex-col overflow-hidden px-2 rounded-xl md:rounded-2xl border border-[#4C4C4C]">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hey Jane, how can I back you up?"
          spellCheck={false}
          className="min-h-[40px] w-full resize-none bg-transparent px-2 py-[1.0rem] focus-within:outline-none sm:text-md"
        />
        <div className="absolute right-2 top-1.5 sm:right-3">
          <Button
            type="submit"
            className={cn(
              buttonVariants({ size: "sm", variant: "secondary" }),
              "mt-1 h-8 w-8 rounded-md p-0 bg-white"
            )}
            disabled={isLoading || input === ""}
          >
            <RxArrowUp size="18px" color="#000" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
