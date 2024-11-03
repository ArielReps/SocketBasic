export default interface SocketDTO{
    name:string,
    message: string,
    room: string,
    date:string
    request:"message" | "room"
    success?:boolean
}
