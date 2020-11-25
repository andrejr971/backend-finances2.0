/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('register', 'UserController.store')
  Route.post('session', 'SessionController.store')
  Route.post('forgot-password', 'ForgotPasswordController.store')
  Route.post('reset-password', 'ResetPasswordController.store')

  Route.get('/files/:id', 'FileController.index')
}).prefix('/api/v1')

Route.group(() => {
  Route.get('balance', 'DashboardController.index')
  Route.get('charts', 'ChartController.index')

  Route.put('profile', 'UserController.update')
  Route.get('profile', 'UserController.show')
  Route.post('profile/avatar', 'UpdateAvatarUserController.store')

  Route.get('categories', 'CategoryController.index')
  Route.post('categories', 'CategoryController.store')
  Route.put('categories/:id', 'CategoryController.update')
  Route.get('categories/:id', 'CategoryController.show')

  Route.resource('transactions', 'TransactionController').apiOnly()

  Route.delete('logout', 'SessionController.destroy')
})
  .prefix('/api/v1')
  .middleware(['auth'])
