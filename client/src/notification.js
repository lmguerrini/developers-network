import toaster from "toasted-notes";
//import "toasted-notes/src/styles.css"; 

export default function NotificationToaster() {

    const test = (
        <>
            <h1 /* id="test" */>TEST</h1>
        </>
    );

    return (
        <>
            <h1>Notifications</h1>
            {/*  <button
                onClick={() => {
                    toaster.notify("Notification test", {
                        duration: 5000,
                        //position: "bottom-left",
                    });
                }}
            >
                notificationToaster
            </button> */}
            <button
                onClick={() => {
                    toaster.notify(test, {
                        duration: 2000,
                        //position: "bottom-left",
                    });
                }}
            >
                notificationToaster
            </button>
            {/* <h1 id="test">TEST TEST TEST TEST TEST </h1> */}
            {/* <button
                onClick={() => {
                    toaster.notify(<div id='test'>Hi there</div>);
                }}
            >
                notificationToaster
            </button> */}
        </>
    );
}



