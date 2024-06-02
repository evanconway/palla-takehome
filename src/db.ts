export const getDB = () => {
  // @ts-ignore
  if (!global.database) {
    // @ts-ignore
    global.database = {
      time: Date.now(),
    };
  }

  // @ts-ignore
  const db = global.database;

  const getDBTime = () => {
    return db.time;
  };

  return { getDBTime };
};

// // lib/db.js
// import level from 'level'

// export const getDB = () => {
//   if (!global.database) {
//     // save DB instance in global object for reuse
//     global.database = level('__db__')
//   }
//   const db = global.database

//   async function findById(id) {
//     const result = await db.get(id)
//     return JSON.parse(result)
//   }

//   async function find({ email } = {}) {/* ... */}
//   async function update(id, payload) {/* ... */}
//   async function create(payload) {/* ... */}

//   return {
//     find,
//     findById,
//     update,
//     create,
//   }
// }
