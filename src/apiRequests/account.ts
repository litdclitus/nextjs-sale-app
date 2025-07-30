import http from "@/lib/http";
import { AccountResType } from "@api/schemaValidations/account.schema";

const accountApiRequest = {
    me: ({ sessionToken }: { sessionToken: string }) => http.get<AccountResType>('/account/me', { headers: { Authorization: `Bearer ${sessionToken}` } }),
}

export default accountApiRequest;