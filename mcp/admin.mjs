import { provision, provisionHash, revoke, deleteStudent, trends } from './store.mjs';
const [command, arg, hash] = process.argv.slice(2);
try {
  if (command === 'provision-student') console.log(JSON.stringify(provision('student', arg)));
  else if (command === 'provision-instructor') console.log(JSON.stringify(provision('instructor', arg)));
  else if (command === 'provision-student-hash') console.log(JSON.stringify(provisionHash('student', arg, hash)));
  else if (command === 'provision-instructor-hash') console.log(JSON.stringify(provisionHash('instructor', arg, hash)));
  else if (command === 'revoke') { revoke(arg); console.log('Revoked'); }
  else if (command === 'delete-student') { deleteStudent(arg); console.log('Student records deleted and token revoked'); }
  else if (command === 'trends') console.log(JSON.stringify(trends(), null, 2));
  else { console.error('Usage: node admin.mjs provision-student ID | provision-instructor ID | provision-student-hash ID SHA256 | provision-instructor-hash ID SHA256 | revoke ID | delete-student ID | trends'); process.exitCode = 2; }
} catch (e) { console.error(e.message); process.exitCode = 1; }
