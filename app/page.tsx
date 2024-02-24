"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RiUserLine } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { v4 as uuidv4 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import PromptForm from "@/components/prompt-form";
import { MemoizedReactMarkdown } from "@/components/markdown";
import { CodeBlock } from "@/components/codeblock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MessageSkeleton from "@/components/message-skeleton";
import { getIconAndColor } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/header";
import Link from "next/link";
import { TbChevronRight } from "react-icons/tb";

const API_URL = `https://api.beta.superagent.sh/api/v1/agents/${process.env.NEXT_PUBLIC_SUPERAGENT_AGENT_ID}/invoke`;

function FileType({ url }: { url: string }) {
  const { icon: Icon, color } = getIconAndColor(url);
  return <Icon className={`${color}`} />;
}

function Message({
  type,
  message,
  sources = [],
}: {
  type: string;
  message: string;
  sources: any;
  onResubmit?: () => void;
}) {
  return (
    <div className="flex flex-col space-y-1 pb-4">
      <div className="min-w-4xl flex max-w-4xl space-x-4">
        <Avatar
          className={`h-10 w-10 rounded-md p-[1px] ${
            type === "ai" && message.length === 0
              ? "animate-border bg-gradient-to-r from-transparent via-gray-500 to-white bg-[length:400%_400%]"
              : "bg-transparent border border-[#4C4C4C]"
          }`}
        >
          <AvatarFallback
            className={
              type === "human"
                ? "rounded-md bg-transparent "
                : "rounded-md bg-[#111111]"
            }
          >
            {type === "human" ? (
              <RiUserLine color="white" />
            ) : (
              <IoIosArrowForward />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 mt-2 flex-1 flex-col space-y-10 overflow-hidden px-1">
          {message?.length === 0 && <MessageSkeleton />}
          <MemoizedReactMarkdown
            className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words text-md"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              table({ children }) {
                return (
                  <div className="mb-2 rounded-md border">
                    <Table>{children}</Table>
                  </div>
                );
              },
              thead({ children }) {
                return <TableHeader>{children}</TableHeader>;
              },
              tbody({ children }) {
                return <TableBody>{children}</TableBody>;
              },
              tr({ children }) {
                return <TableRow>{children}</TableRow>;
              },
              th({ children }) {
                return <TableHead className="py-2">{children}</TableHead>;
              },
              td({ children }) {
                return <TableCell className="py-2">{children}</TableCell>;
              },
              p({ children }) {
                return <p className="mb-2">{children}</p>;
              },
              a({ children, href }) {
                return (
                  <a
                    href={href}
                    className="text-[#91FFC4] underline"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {children}
                  </a>
                );
              },
              ol({ children }) {
                return (
                  <ol className="mb-5 list-decimal pl-[30px]">{children}</ol>
                );
              },
              ul({ children }) {
                return <ul className="mb-5 list-disc pl-[30px]">{children}</ul>;
              },
              li({ children }) {
                return <li className="pb-1">{children}</li>;
              },
              // @ts-ignore
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ""}
                    value={String(children).replace(/\n$/, "")}
                    {...props}
                  />
                ) : (
                  <Badge variant="outline" className="text-md" {...props}>
                    {children}
                  </Badge>
                );
              },
            }}
          >
            {message}
          </MemoizedReactMarkdown>

          {sources?.response?.data?.length > 0 && type === "ai" && (
            <div className="flex flex-col space-y-2 mt-4">
              <p className="text-sm text-muted-foreground">SOURCES</p>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  {sources.response.data.map((source: any, index: number) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="flex text-sm font-mono justify-between bg-zinc-900 border-gray-600 border"
                        >
                          <p className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[70%]">
                            {source.doc_url}
                          </p>
                          <div>
                            <FileType url={source.doc_url} />
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>Source</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col">
                          <ScrollArea className="h-[250px] font-mono text-sm">
                            {source.content}
                          </ScrollArea>
                          <div className="pt-4 mt-2 flex items-center justify-between border-t border-gray-700">
                            <p className="text-muted-foreground">
                              Page number: {source.page_number}
                            </p>
                            <Link href="" passHref>
                              <Button size="sm" className="space-x-2">
                                <span>Go to document</span>
                                <TbChevronRight />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [sessionId, setSessionId] = React.useState<string>(uuidv4());
  const [messages, setMessages] = React.useState<
    { type: string; message: any; sources: any[] }[]
  >([]);
  const [sources, setSources] = React.useState<object | null>();

  async function onSubmit(value: string) {
    let message = "";
    setSources(null);
    setMessages([{ type: "human", message: value, sources: [] }]);

    setMessages((previousMessages) => [
      ...previousMessages,
      { type: "ai", message, sources: [] },
    ]);

    await fetchEventSource(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPERAGENT_API_KEY}`,
      },
      body: JSON.stringify({
        input: value,
        enableStreaming: true,
        sessionId: sessionId,
      }),
      openWhenHidden: true,
      async onmessage(event) {
        if (event.event === "function_call") {
          const sources = JSON.parse(event.data);
          setSources(sources);
        }
        if (event.data !== "[END]" && event.event !== "function_call") {
          message += event.data === "" ? `${event.data}\n` : event.data;
          setMessages((previousMessages) => {
            let updatedMessages = [...previousMessages];

            let aiMessageIndex = -1;
            for (let i = updatedMessages.length - 1; i >= 0; i--) {
              if (updatedMessages[i].type === "ai") {
                updatedMessages[i].message = message;
                aiMessageIndex = i;
                break;
              }
            }
            return updatedMessages;
          });
        }
      },
    });
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="relative flex flex-1 flex-col overflow-hidden border-r">
        <ScrollArea className="relative flex grow flex-col px-4">
          <div className="from-[#262626] absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-0% to-transparent to-30%" />
          <div className="mb-20 mt-10 flex flex-col space-y-5 py-5">
            <div className="container sm:w-full mx-auto px-0 flex max-w-3xl flex-col">
              {messages.map(({ type, message }, index) => (
                <Message
                  key={index}
                  type={type}
                  message={message}
                  sources={sources}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
        <div className="from-[#262626] fixed inset-x-0 bottom-0 z-50 h-16 md:h-28 bg-gradient-to-t from-50% to-transparent to-100%">
          <div className="relative mx-auto mb-6 max-w-3xl px-4 md:px-8">
            <PromptForm
              onSubmit={async (value) => {
                onSubmit(value);
              }}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
