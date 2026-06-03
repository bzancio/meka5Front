import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isLoggedIn()) {
    return true
  }

  router.navigate(['/login'])
  return false
}

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (!authService.isLoggedIn()) {
    return true
  }

  router.navigate(['/home'])
  return false
}
