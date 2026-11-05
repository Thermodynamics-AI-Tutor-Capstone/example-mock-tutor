import { provision, provisionHash, revoke, deleteStudent, trends } from './store.mjs';
import { accountById, addInvite, disableAccount } from './oauth.mjs';
const [command, arg, hash, role, inviteHash] = process.argv.slice(2);
try {
  if (command === 'provision-student') console.log(JSON.stringify(provision('student', arg)));
  else if (command === 'provision-instructor') console.log(JSON.stringify(provision('instructor', arg)));
  else if (command === 'provision-student-hash') console.log(JSON.stringify(provisionHash('student', arg, hash)));
  else if (command === 'provision-instructor-hash') console.log(JSON.stringify(provisionHash('instructor', arg, hash)));
  else if (command === 'invite-hash') console.log(JSON.stringify(addInvite(arg, hash, role, inviteHash)));
  else if (command === 'disable-account') { disableAccount(arg); console.log('Account disabled'); }
  else if (command === 'revoke') { revoke(arg); console.log('Revoked'); }
  else if (command === 'delete-student') { deleteStudent(arg); if (accountById(arg)) disableAccount(arg); console.log('Student records deleted and account access disabled'); }
  else if (command === 'trends') console.log(JSON.stringify(trends(), null, 2));
  else { console.error('Usage: node admin.mjs invite-hash ID NAME student|instructor SHA256 | disable-account ID | provision-student ID | provision-instructor ID | revoke ID | delete-student ID | trends'); process.exitCode = 2; }
} catch (e) { console.error(e.message); process.exitCode = 1; }
