export type StatusName =
  | "OK"
  | "Created"
  | "Bad Request"
  | "Unauthorized"
  | "Forbidden"
  | "Not Found"
  | "Internal Server Error";

export const statusMap: { statusName: StatusName; code: number }[] = [
  { statusName: "OK", code: 200 },
  { statusName: "Created", code: 201 },
  { statusName: "Bad Request", code: 400 },
  { statusName: "Unauthorized", code: 401 },
  { statusName: "Forbidden", code: 403 },
  { statusName: "Not Found", code: 404 },
  { statusName: "Internal Server Error", code: 500 },
];

export class AppError extends Error {
  public statusCode: number;
  public username: string | undefined;

  constructor(
    message: string,
    statusName: StatusName = "Internal Server Error",
    username?: string
  ) {
    super(message);
    this.statusCode =
      statusMap.find((s) => {
        return s.statusName === statusName;
      })?.code || 500;
    if (username) this.username = username;
  }
}
