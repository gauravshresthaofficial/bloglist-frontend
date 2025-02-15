const Notification = ({ notification, setNotification }) => {
    if (notification === null) {
        return null
    }
    setTimeout(() => {
        setNotification(null)
    }, 5000);

    return (
        <div className={`notification ${notification.type}`}>
            {notification.text}
        </div>
    )
}

export default Notification