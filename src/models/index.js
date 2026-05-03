import Client from "./Clients.model.js";
import Process from "./Process.model.js";
import State from "./State.model.js";
import User from "./User.model.js";
import ProcessState from "./ProcessState.model.js";
import Group from "./Group.model.js";
import GroupMember from "./GroupMember.model.js";
import sequelize from "../config/connect.js";

User.hasMany(Client, { foreignKey: "id_user" });
Client.belongsTo(User, { foreignKey: "id_user" });

User.hasMany(State, { foreignKey: "id_user" });
State.belongsTo(User, { foreignKey: "id_user" });

Client.hasMany(Process, { foreignKey: "id_client" });
Process.belongsTo(Client, { foreignKey: "id_client" });

Process.hasMany(ProcessState, { foreignKey: "id_process" });
ProcessState.belongsTo(Process, { foreignKey: "id_process" });

State.hasMany(ProcessState, { foreignKey: "id_state", onDelete: "CASCADE" });
ProcessState.belongsTo(State, { foreignKey: "id_state" });

User.hasMany(Group, { foreignKey: "admin_id", as: "ownedGroups" });
Group.belongsTo(User, { foreignKey: "admin_id", as: "admin" });

Group.hasMany(GroupMember, { foreignKey: "group_id"});
GroupMember.belongsTo(Group, { foreignKey: "group_id" });

User.hasMany(GroupMember, { foreignKey: "user_id", as: "memberships" });
GroupMember.belongsTo(User, { foreignKey: "user_id", as: "member", onDelete: "CASCADE"});

const db = {
    sequelize,
    User,
    Client,
    Process,
    State,
    ProcessState,
    Group,
    GroupMember
};

export default db;
