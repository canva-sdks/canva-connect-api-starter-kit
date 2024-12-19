import type { GetUserProfileResponse } from "@canva/connect-api-ts";
import { UserService } from "@canva/connect-api-ts";
import type { Client } from "@hey-api/client-fetch";

export class Users {
  constructor(private client: Client) {}

  async getUserProfile(): Promise<GetUserProfileResponse> {
    const result = await UserService.getUserProfile({
      client: this.client,
    });
    if (result.error) {
      console.error(result.error);
      throw new Error(`Error fetching user profile: ${result.error.message}`);
    }
    return result.data;
  }
}
