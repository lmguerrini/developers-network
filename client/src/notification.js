import toaster from "toasted-notes";

export default function NotificationToaster() {

    return (
        <>
            <h1>Notifications</h1>
            <button
                onClick={() => {
                    toaster.notify("Notification test", {
                        duration: 5000,
                    });
                }}
            >
                notificationToaster
            </button>
        </>
    );
}



