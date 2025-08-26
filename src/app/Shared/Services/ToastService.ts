import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {

  show(message: string, type: 'success' | 'error' = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.padding = '10px 20px';
    toast.style.color = 'white';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '10000';
    toast.style.background = type === 'success' ? '#4caf50' : '#f44336';
    toast.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    toast.style.transition = 'all 0.3s ease';

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
    }, 2500);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
