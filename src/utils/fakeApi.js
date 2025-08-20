export function sendFakeOTP(){
  return new Promise((res)=> setTimeout(()=> res(true), 800))
}

export function verifyFakeOTP(code){
  return new Promise((res, rej)=> setTimeout(()=> { if(code === '123456' || code === undefined) res(true); else rej(new Error('Invalid OTP')) }, 600))
}

export function fakeAIReply(dispatch, roomId, userMessage){
  setTimeout(()=>{
    // typing delay
    setTimeout(()=>{
      const reply = { id: 'ai-'+Date.now(), text: 'Gemini: reply to - ' + (userMessage.text || '[image]'), from: 'ai', createdAt: new Date().toISOString() }
      dispatch({ type: 'chat/addMessage', payload: { roomId, message: reply } })
    }, 800)
  }, 1200)
}
