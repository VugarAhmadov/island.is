import AsyncStorage from '@react-native-community/async-storage'
import { NotificationResponse, setBadgeCountAsync } from 'expo-notifications'
import { Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import createUse from 'zustand'
import { persist } from 'zustand/middleware'
import create, { State } from 'zustand/vanilla'
import { navigateToNotification } from '../lib/deep-linking'
import { ComponentRegistry } from '../utils/component-registry'
import { getRightButtons } from '../utils/get-main-root'

export interface Notification {
  id: string
  category?: string
  title: string
  subtitle?: string
  body?: string
  copy?: string
  data: Record<string, any>
  date: number
  read: boolean
}

interface NotificationsStore extends State {
  items: Map<string, Notification>
  unreadCount: number
  getNotifications(): Notification[]
  actions: {
    handleNotificationResponse(response: NotificationResponse): Notification
    setRead(notificationId: string): void
    setUnread(notificationId: string): void
  }
}

const firstNotification: Notification = {
  id: 'FIRST_NOTIFICATION',
  title: 'Stafrænt Ísland',
  body: 'Fyrsta útgáfa af Ísland.is appinu',
  copy:
    'Í þessari fyrstu útgáfu af Ísland.is appinu getur þú nálgast rafræn skjöl og skírteini frá hinu opinbera, fengið tilkynningar og séð stöðu umsókna.',
  date: new Date().getTime(),
  data: {},
  read: true,
}

export const notificationCategories = [
  {
    categoryIdentifier: 'NEW_DOCUMENT',
    actions: [
      {
        identifier: 'ACTION_OPEN_DOCUMENT',
        buttonTitle: 'Opna skjal',
        onPress: ({ id, data }: Notification, componentId?: string) =>
          navigateToNotification(
            { id, link: `/inbox/${data.documentId}` },
            componentId,
          ),
      },
      {
        identifier: 'ACTION_MARK_AS_READ',
        buttonTitle: 'Merkja sem lesið',
        onPress: ({ id }: Notification) =>
          notificationsStore.getState().actions.setRead(id),
      },
    ],
    data: {
      documentId: '',
    },
  },
  {
    categoryIdentifier: 'ISLANDIS_LINK',
    actions: [
      {
        identifier: 'ACTION_OPEN_ON_ISLAND_IS',
        buttonTitle: 'Opna á Ísland.is',
        onPress: ({ id, data }: Notification, componentId?: string) =>
          navigateToNotification({ id, link: data.islandIsUrl }, componentId),
      },
      {
        identifier: 'ACTION_MARK_AS_READ',
        buttonTitle: 'Merkja sem lesið',
        onPress: ({ id }: Notification) =>
          notificationsStore.getState().actions.setRead(id),
      },
    ],
    data: {
      islandIsUrl: '',
    },
  },
]

const rightButtonScreens = [
  ComponentRegistry.HomeScreen,
  ComponentRegistry.InboxScreen,
  ComponentRegistry.WalletScreen,
]

export function actionsForNotification(
  notification: Notification,
  componentId?: string,
) {
  const category = notificationCategories.find(
    (c) => c.categoryIdentifier === notification.category,
  )
  if (category) {
    return category.actions
      .filter((action) => action.identifier !== 'ACTION_MARK_AS_READ')
      .map((action) => ({
        text: action.buttonTitle,
        onPress: () => action.onPress(notification, componentId),
      }))
  }
  return []
}

export const notificationsStore = create<NotificationsStore>(
  persist(
    (set, get) => ({
      items: new Map(),
      unreadCount: 0,
      getNotifications() {
        return [...get().items.values()].sort((a, b) => b.date - a.date)
      },
      actions: {
        handleNotificationResponse(response: NotificationResponse) {
          const { items } = get()
          const {
            date,
            request: { content, identifier, trigger },
          } = response.notification

          if (items.has(identifier)) {
            // ignore notification model updates
            return items.get(identifier)!
          }

          const data = {
            ...(content.data || {}),
            ...((trigger as any).payload || {}),
          }
          const model = {
            id: identifier,
            date: date * 1000,
            category: (content as any).categoryIdentifier,
            title: content.title ?? '',
            subtitle: content.subtitle || undefined,
            body: content.body || undefined,
            copy: data.copy,
            data,
            read: false,
          }
          items.set(model.id, model)
          set({ items: new Map(items) })
          return model
        },
        setRead(notificationId: string) {
          const { items } = get()
          const notification = items.get(notificationId)
          if (notification) {
            notification.read = true
          }
          set({ items: new Map(items) })
        },
        setUnread(notificationId: string) {
          const { items } = get()
          const notification = items.get(notificationId)
          if (notification) {
            notification.read = false
          }
          set({ items: new Map(items) })
        },
      },
    }),
    {
      name: 'notifications_06',
      getStorage: () => AsyncStorage,
      serialize({ state, version }) {
        const res: any = { ...state }
        res.items = [...res.items]
        return JSON.stringify({ state: res, version })
      },
      deserialize(str: string) {
        const { state, version } = JSON.parse(str)
        delete state.actions
        state.items = new Map(state.items)
        return { state, version }
      },
    },
  ),
)

notificationsStore.subscribe(
  (items: Map<string, Notification>) => {
    const unreadCount = [...items.values()].reduce((acc, item) => {
      return acc + (item.read ? 0 : 1)
    }, 0)
    if (Platform.OS === 'ios') {
      setBadgeCountAsync(unreadCount)
    }
    notificationsStore.setState({ unreadCount })
    rightButtonScreens.forEach((componentId) => {
      Navigation.mergeOptions(componentId, {
        topBar: {
          rightButtons: getRightButtons({ unreadCount }),
        },
      })
    })
  },
  (s) => s.items,
)

if (notificationsStore.getState().items.size === 0) {
  const { items } = notificationsStore.getState()
  items.set(firstNotification.id, firstNotification)
  notificationsStore.setState({ items })
}

export const useNotificationsStore = createUse(notificationsStore)