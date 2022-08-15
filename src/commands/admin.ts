/**
 *
 * April 02, 2022
 * N3rdP1um23
 * The following file is used to represent various admin commands
 *
 */

// Import required packages
import { TextChannel, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Pagination } from "@discordx/pagination";
import { supported_countries } from "../constants.ts";

// Define the class that holds the various admin commands
@Discord()
@SlashGroup({ name: "admin", description: "Admin functions." })
@SlashGroup("admin")
export abstract class Admin {
  // Define a command to handle listing all supported Ikea Countries in a paginated menu
  @Slash("alerts-channel")
  async alertsChannel(
    @SlashOption("channel", {
      description: "Channel to send notifications to.",
      required: true,
    })
    channel: TextChannel,
    interaction: CommandInteraction
  ): Promise<any> {
    // Send the data off to be added into the local DB
    await interaction.reply(
      `Stock notification messages will now be shared in ${channel.toString()}`
    );

    channel.send(channel.id);
    channel.send(channel.toString());
  }
}
