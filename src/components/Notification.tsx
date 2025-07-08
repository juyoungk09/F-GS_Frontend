import type { Component } from "solid-js";

interface NotificationProps {
  senderName: string;
}

const Notification: Component<NotificationProps> = ({ senderName }) => {
  return (
    <div class="notification">
      <div class="notification-header">
        <span class="sender-name">{senderName}</span>
      </div>
      <div class="notification-content">
        {/* Notification content will go here */}
      </div>
    </div>
  );
};

export default Notification;
