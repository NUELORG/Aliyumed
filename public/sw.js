// Aliyumed Service Worker for Background Notifications

const CACHE_NAME = 'aliyumed-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let data = {
    title: 'Aliyumed Reminder',
    body: 'Time to take your medication!',
    icon: '/pill.svg',
    badge: '/pill.svg'
  };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/pill.svg',
    badge: data.badge || '/pill.svg',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'medication-reminder',
    requireInteraction: true,
    actions: [
      { action: 'take', title: '✓ Mark as Taken' },
      { action: 'snooze', title: '⏰ Snooze 5 min' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  event.notification.close();
  
  const action = event.action;
  const notificationData = event.notification.data;
  
  if (action === 'take') {
    // Open the app and mark as taken
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            client.postMessage({ type: 'MARK_TAKEN', medicationId: notificationData.medicationId });
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow('/dashboard?action=taken&id=' + notificationData.medicationId);
        }
      })
    );
  } else if (action === 'snooze') {
    // Schedule another notification in 5 minutes
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          client.postMessage({ 
            type: 'SNOOZE', 
            medicationId: notificationData.medicationId,
            minutes: 5
          });
        }
      })
    );
  } else {
    // Default click - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/dashboard');
        }
      })
    );
  }
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data.type === 'SCHEDULE_ALARM') {
    const { medication, delay } = event.data;
    
    // Schedule the notification
    setTimeout(() => {
      self.registration.showNotification(`⏰ Time for ${medication.name}!`, {
        body: `Dosage: ${medication.dosage}`,
        icon: '/pill.svg',
        badge: '/pill.svg',
        vibrate: [200, 100, 200, 100, 200],
        tag: `med-${medication.id}`,
        requireInteraction: true,
        actions: [
          { action: 'take', title: '✓ Mark as Taken' },
          { action: 'snooze', title: '⏰ Snooze 5 min' },
          { action: 'dismiss', title: '✕ Dismiss' }
        ],
        data: {
          medicationId: medication.id,
          medicationName: medication.name,
          dosage: medication.dosage
        }
      });
    }, delay);
  }
  
  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, medication } = event.data;
    
    self.registration.showNotification(title, {
      body: body,
      icon: '/pill.svg',
      badge: '/pill.svg',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: medication ? `med-${medication.id}` : 'aliyumed-notification',
      requireInteraction: true,
      actions: [
        { action: 'take', title: '✓ Taken' },
        { action: 'snooze', title: '⏰ Snooze' },
        { action: 'dismiss', title: '✕ Dismiss' }
      ],
      data: medication || {}
    });
  }
});

// Background sync for checking medications
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-medications') {
    event.waitUntil(checkMedications());
  }
});

async function checkMedications() {
  // This would ideally fetch from a server
  // For now, we rely on the main app to schedule notifications
  console.log('Background sync: checking medications');
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'medication-check') {
    event.waitUntil(checkMedications());
  }
});

