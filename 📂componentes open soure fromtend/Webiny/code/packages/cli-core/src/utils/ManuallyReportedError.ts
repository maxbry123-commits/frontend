export class ManuallyReportedError extends Error {
    static from(cause: Error): ManuallyReportedError {
        return new ManuallyReportedError(cause.message, { cause });
    }
}
