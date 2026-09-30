import ChatInputModal from "../chat/chatInputModal";

export default function CallInputModal({
  onCall,
  ...props
}) {
  return (
    <ChatInputModal
      {...props}
      consultationType="call"
      onChat={onCall}
    />
  );
}
