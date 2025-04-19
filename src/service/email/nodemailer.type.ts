export interface IEmailService {
    sendEmail: (to: string, token: string) => Promise<void>
}