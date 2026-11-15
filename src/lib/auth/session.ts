import { getServerSession } from "next-auth";
import { authOptions } from "./options";
export const getUserSession = () => getServerSession(authOptions);
