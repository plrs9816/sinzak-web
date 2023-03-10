import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai/react";
import { RESET } from "jotai/vanilla/utils";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import ReactTextareaAutosize from "react-textarea-autosize";

import { Button } from "@components/atoms/Button";
import { BackIcon, MenuIcon, PictureFilledIcon } from "@lib/icons";
import { useAuth } from "@lib/services/auth";
import { formatNumber } from "@lib/services/intl/format";
import useClient from "@lib/services/stomp/client";
import useStomp from "@lib/services/stomp/stomp";

import { VirtualizedScroller } from "./VirtualizedScroller";
import { useChatQuery } from "../../queries/chat";
import { useRoomInfoQuery } from "../../queries/roomInfo";
import { roomIdAtom } from "../../states";
import { MessageResponse } from "../../types";

export const ChatRoomView = ({ roomId }: { roomId: string }) => {
  const client = useClient();
  const { user } = useAuth();
  const setRoomId = useSetAtom(roomIdAtom);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const programmaticScroll = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const queryClient = useQueryClient();
  const { data } = useRoomInfoQuery(roomId);

  useLayoutEffect(() => {
    setAutoScroll(true);
  }, [roomId]);

  const { data: messageList, fetchNextPage } = useChatQuery(roomId);

  const callback = useCallback(
    (message: any) => {
      queryClient.setQueryData<InfiniteData<MessageResponse>>(
        ["prevChat", roomId],
        (data) => {
          if (!data) return data;
          const { pages, pageParams } = data;
          const [firstPage, ...restPages] = pages;
          const { content, ...firstPageData } = firstPage;
          message.sendAt = new Date().toISOString();
          message.messageId = Date.now();
          if (message.senderId === user?.userId) setAutoScroll(true);
          return {
            pages: [
              {
                content: [message, ...content],
                ...firstPageData,
              },
              ...restPages,
            ],
            pageParams,
          };
        }
      );
    },
    [queryClient, roomId, user?.userId]
  );

  useStomp({
    topic: `/sub/chat/rooms/${roomId}`,
    enabled: !!messageList,
    callback,
  });

  const onSubmit = (text: string) => {
    if (!client) return;
    const body = {
      roomId,
      message: text,
      sender: "test",
      senderId: user?.userId,
      messageType: "TEXT",
    };
    console.log(body);
    client.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(body),
    });
  };

  if (!user) return null;

  return (
    <>
      <div
        className={
          "flex h-[100dvh] flex-col max-md:container max-md:absolute max-md:-mb-24 max-md:pb-20 md:h-full md:px-4" +
          " " +
          "h-full"
        }
      >
        <div className="relative flex h-12 flex-shrink-0 items-center justify-between bg-white max-md:sticky max-md:top-0">
          <span className="absolute inset-y-0 left-1/2 grid -translate-x-1/2 place-items-center font-bold">
            {data?.roomName}
          </span>
          <button onClick={() => setRoomId(RESET)}>
            <BackIcon />
          </button>
          <span>
            <MenuIcon />
          </span>
        </div>
        <Link
          href={data ? `/market/${data.productId}` : "#"}
          className="flex space-x-4 px-2 py-4"
        >
          <span className="inline-block h-10 w-10 rounded-xl bg-gray-200" />
          <div className="flex flex-col justify-around">
            <p className="flex items-center">
              <span className="space-x-1 text-sm">
                {data ? (
                  <>
                    <span className="font-bold">
                      {data.complete ? "?????????" : "????????????"}
                    </span>
                    <span>{data.productName}</span>
                  </>
                ) : (
                  <Skeleton className="w-28" />
                )}
              </span>
            </p>
            <p className="flex space-x-1">
              <span className="space-x-1 text-sm">
                {data ? (
                  <>
                    <span className="text-gray-800">
                      {formatNumber(data.price)}???
                    </span>
                    <span className="text-gray-600">
                      {data.suggest ? "??????????????????" : "??????????????????"}
                    </span>
                  </>
                ) : (
                  <Skeleton className="w-32" />
                )}
              </span>
            </p>
          </div>
        </Link>
        <div className="relative min-h-0 flex-[1_1_auto] max-md:bleed md:-mx-4">
          {!!messageList?.length && (
            <VirtualizedScroller
              autoScroll={autoScroll}
              setAutoScroll={setAutoScroll}
              programmaticScroll={programmaticScroll}
              scrollRef={scrollRef}
              userId={user.userId}
              messageList={messageList}
              fetchNextPage={fetchNextPage}
            />
          )}
          {!autoScroll && (
            <Button
              ref={buttonRef}
              onClick={() => {
                setAutoScroll(true);
              }}
              size="small"
              intent="primary"
              className="absolute bottom-2 left-1/2 -translate-x-1/2"
            >
              ??? ?????????
            </Button>
          )}
          <button onClick={(e) => e} />
        </div>
        <div
          className="flex items-center space-x-3 px-4 py-4
            max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:bg-white
            md:-mx-4"
        >
          <span>
            <PictureFilledIcon className="h-10 w-10 fill-gray-600" />
          </span>
          <span className="flex-1 rounded-[1.5rem] bg-gray-100 py-3 ring-gray-200 focus-within:ring-1">
            <ReactTextareaAutosize
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (e.currentTarget.value.trim() === "") return;
                  onSubmit(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.relatedTarget === buttonRef.current)
                  e.currentTarget.focus();
              }}
              maxRows={3}
              ref={inputRef}
              placeholder="????????? ?????????"
              className="flex w-full resize-none items-center bg-transparent px-6 font-medium scrollbar-hide focus:ring-0"
            />
          </span>
        </div>
      </div>
    </>
  );
};
