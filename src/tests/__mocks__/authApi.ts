export async function loginApi({ email, password }: { email:string; password:string }){
  // fake network: success for any valid credentials
  await new Promise(r => setTimeout(r, 50))
  if(!email.includes('@') || password.length < 6) throw new Error('Invalid')
  return { user: { id: '1', name: 'Admin' }, token: 'fake-token' }
}
