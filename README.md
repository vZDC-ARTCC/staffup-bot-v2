# vZDC Staff Update Bot:

## Introduction:
This Discord bot provides real-time updates on the status of controllers in the virtual Washington ARTCC (vZDC) on the VATSIM network. 
The bot regularly fetches data from VATSIM, filters controllers based on specific categories, and updates Discord channels with the current controller status.

## Installation:
1. Clone the Repository:
    git clone https://github.com/vZDC-ARTCC/staffup-bot-v2.git
2. Install Dependencies:
    Navigate to the project directory and install the required dependencies using:
        npm install
3. Configure Bot Token:
    Rename the file create_config.json in the dist folder to config.json and replace DISCORD_TOKEN with your Discord bot token.
4. Update Channel Names:
    Open dist/index.js and update lines 79,102,108 and 203 with the names of the channels where announcements should be posted.

## Usage:-
    Start the bot with the following command:
        node dist/index.js

## CAUTION:- 
    At the time of log in the bot will delet all previous messages from that particular channel !!

Contributions are warmly welcome! 

If you encounter any issues or have any kind of questions, feel free to open an issue on the GitHub repository.