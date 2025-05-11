import { handleChatFlow } from "../services/expertFinder.js"


export const sendChat = async (req, res, next) =>{
    try{
       const {messages,step,answers} = req.body

       const response = await handleChatFlow(messages,step,answers)
       return res.status(200).json({data:response,status:200,message:"Chat response retrived successfully."})
    }catch(err){
        next(err)
    }
}