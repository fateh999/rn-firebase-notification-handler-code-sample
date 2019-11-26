# rn-firebase-notification-handler-code-sample


Add the following code in a root screen.


```

  function onNotificationOpened(notification: any) {
    console.log(notification.data);
    //Handle Notification
  }
  
  function onNotificationReceived(notification: any) {
    console.log(notification.data);
    console.log(notification);
    //Handle Notification
  }

  useEffect(() => {
    NotificationHandler.init();
    NotificationHandler.listenNotificationsOpened(onNotificationOpened);
    NotificationHandler.listenNotificationsForeground(onNotificationReceived);
    NotificationHandler.listenNotificationsAppKill(onNotificationOpened);
    return () => {
      NotificationHandler.removeListeners();
    }
  ,[]}
  
  ```
