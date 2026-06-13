/**
 * ServiceFlow Notification Service
 * 
 * Creates persistent in-app notifications and optionally dispatches emails.
 * All notifications are stored in the Notification entity for retrieval.
 */


class NotificationService {
    async notify({
        recipientEmail,
        recipientRole = 'customer',
        type,
        title,
        body,
        actionUrl = null,
        resourceType = null,
        resourceId = null,
        priority = 'normal',
        source = 'system',
        sendEmail = false,
    }) {
        // Create in-app notification
            recipient_email: recipientEmail,
            recipient_role: recipientRole,
            type,
            title,
            body,
            action_url: actionUrl,
            resource_type: resourceType,
            resource_id: resourceId,
            priority,
            source,
            is_read: false,
        });

        // Optionally send email
        if (sendEmail) {
                to: recipientEmail,
                subject: title,
                body: `${body}\n\n---\nServiceFlow Team`,
            }).catch(e => console.warn('[NotificationService] Email send failed:', e));
        }

        return notification;
    }

    async notifyProvider({ providerEmail, type, title, body, ...rest }) {
        return this.notify({ recipientEmail: providerEmail, recipientRole: 'provider', type, title, body, ...rest });
    }

    async markRead(notificationId) {
    }

    async markAllRead(recipientEmail) {
        return unread.length;
    }

    async getUnreadCount(recipientEmail) {
        return unread.length;
    }
}

export const notificationService = new NotificationService();