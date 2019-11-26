import firebase from 'react-native-firebase';

class NotificationHandler {
  public fcmToken: string;
  private removeNotificationOpenedListener: any;
  private removeNotificationListener: any;
  private onTokenRefreshListener: any;

  constructor() {
    this.fcmToken = '';
  }

  public async init() {
    try {
      const enabled = await firebase.messaging().hasPermission();

      this.onTokenRefreshListener = firebase
        .messaging()
        .onTokenRefresh(fcmTokenRefreshed => {
          console.log('FCM TOKEN REFRESHED', fcmTokenRefreshed);
          this.fcmToken = fcmTokenRefreshed;
        });

      if (enabled) {
        this.setToken();
      } else {
        await firebase.messaging().requestPermission();
      }
    } catch (error) {}
  }

  private async setToken() {
    const fcmTokenString = await firebase.messaging().getToken();
    if (fcmTokenString) {
      this.fcmToken = fcmTokenString;
      console.log('FCM TOKEN', this.fcmToken);
    } else {
      this.init();
    }
  }

  public getToken() {
    return this.fcmToken;
  }

  public listenNotificationsOpened(callBack: Function) {
    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const action = notificationOpen.action;
        const notification = notificationOpen.notification;
        callBack(notification);
      });
  }

  public async listenNotificationsAppKill(callBack: Function) {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;
      callBack(notification);
    }
  }

  public async listenNotificationsForeground(callBack: Function) {
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        callBack(notification);
      });
  }

  public removeListeners() {
    if (this.removeNotificationOpenedListener)
      this.removeNotificationOpenedListener();
    if (this.removeNotificationListener) this.removeNotificationListener();
    if (this.onTokenRefreshListener) this.onTokenRefreshListener();
  }
}

export default new NotificationHandler();
