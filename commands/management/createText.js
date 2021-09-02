module.exports = {
    usage: `[optional] <users>`,
     createText(messageId, dataManagement, guildId) {
        let content = "**__Pick Your Role__**\n\n" +
            "**React To This Message to Give Yourself A Role**\n\n";

        let roles = dataManagement[guildId]["reactMessages"][messageId]["roles"]
        /*
                    let unordered_roles = [];
                    let ordered_roles = [];

                    for (let role in roles) {
                        if (roles[role]["order"] === 0) {
                            unordered_roles.push(roles[role]);
                        } else ordered_roles.push(roles[role]);
                    }

                    ordered_roles.sort( (a,b) => {
                        return a["order"] - b["order"];
                    })

                    let roles_list = ordered_roles + unordered_roles;
        */
        let roles_text = "";
        let roles_list = roles;
        for (let role in roles_list) {
            let roleId = roles_list[role]["role"]
            let emoji = roles_list[role]["emoji"]
            roles_text += emoji + " <@&" + roleId + ">\n\n"
        }

        return content + roles_text;
    }
};
