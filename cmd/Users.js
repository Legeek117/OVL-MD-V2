const {ovlcmd} = require('../lib/ovlcmd');
const {Ranks} = require('../DataBase/rank');

ovlcmd({
    'nom_cmd': 'listusers',
    'classe': 'Owner',
    'react': '👥',
    'desc': 'Liste tous les utilisateurs qui ont interagi avec le bot'
}, async (chatId, socket, {repondre, ms, prenium_id, arg}) => {
    try {
        // Vérifier que l'utilisateur est premium
        if (!prenium_id) {
            return repondre('❌ Vous n\'avez pas la permission d\'exécuter cette commande. Seuls les utilisateurs premium peuvent voir la liste des utilisateurs.');
        }

        // Récupérer tous les utilisateurs depuis la base de données
        const allUsers = await Ranks.findAll({
            order: [['messages', 'DESC']]
        });

        if (!allUsers || allUsers.length === 0) {
            return repondre('📭 Aucun utilisateur trouvé dans la base de données.');
        }

        // Préparer le message avec la liste des utilisateurs
        let message = `👥 *Liste des utilisateurs du bot*\n\n`;
        message += `📊 Total: ${allUsers.length} utilisateur(s)\n\n`;
        message += `╭───📋 *INFORMATIONS DES UTILISATEURS* ───╮\n`;

        // Limiter l'affichage à 50 utilisateurs pour éviter les messages trop longs
        const limit = arg && arg[0] ? parseInt(arg[0]) : 50;
        const usersToShow = allUsers.slice(0, Math.min(limit, allUsers.length));

        usersToShow.forEach((user, index) => {
            const rank = index + 1;
            const userId = user.id.split('@')[0];
            const name = user.name || 'Inconnu';
            const level = user.level || 0;
            const exp = user.exp || 0;
            const messages = user.messages || 0;

            message += `│ ${rank.toString().padStart(3, ' ')}. 👤 ${name}\n`;
            message += `│     🆔 ID: ${userId}\n`;
            message += `│     📊 Niveau: ${level} | XP: ${exp} | Messages: ${messages}\n`;
            message += `│\n`;
        });

        message += `╰───────────────────────────────────────╯\n`;

        if (allUsers.length > limit) {
            message += `\n⚠️ Affichage limité à ${limit} utilisateurs sur ${allUsers.length} au total.`;
            message += `\n💡 Utilisez \`listusers ${allUsers.length}\` pour voir tous les utilisateurs.`;
        }

        return repondre(message);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return repondre('❌ Une erreur s\'est produite lors de la récupération des utilisateurs.');
    }
});

