
var db;

export const insert_data = (data) => {
  return db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO user (id_user,nama, email, phone, token, image, json) VALUES (?,?,?,?,?,?,?)',
      [data.user.UserId, data.user.Name, data.user.Email, data.user.PhoneNo, data.token, data.user.Photo, JSON.stringify(data.user)],
      (tx, results) => {

      }, function (tx, error) {

      });
  });

};

export const all_data = () => {
  query = "SELECT * FROM user";
  return new Promise((resolve, reject) => db.transaction((tx) => {
    tx.executeSql(query, [], (tx, results) => {
      resolve(results.rows.item(0));
    }, function (tx, error) {
      reject(error);
    });
  }));
};

export const del_all_data = () => {
  return db.transaction(function (tx) {
    tx.executeSql(
      'DELETE FROM user',
      [],
      (tx, results) => {


      }
    );
  });
};

export const all_start = () => {
  query = "SELECT * FROM started";
  return new Promise((resolve, reject) => db.transaction((tx) => {
    tx.executeSql(query, [], (tx, results) => {
      resolve(results.rows.item(0));
    }, function (tx, error) {
      reject(error);
    });
  }));
};


export const insert_start = (data) => {
  return db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO started (id_start) VALUES (?)',
      [data],
      (tx, results) => {

      }
    );
  });

};

export const del_start = () => {
  return db.transaction(function (tx) {
    tx.executeSql(
      'DELETE FROM started',
      [],
      (tx, results) => {


      }
    );
  });
};


export const all_pick = () => {
  query = "SELECT * FROM pickup";
  return new Promise((resolve, reject) => db.transaction((tx) => {
    tx.executeSql(query, [], (tx, results) => {
      resolve(results);
    }, function (tx, error) {
      reject(error);
    });
  }));
};


export const insert_pick = (data) => {
  return db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO pickup (json) VALUES (?)',
      [JSON.stringify(data)],
      (tx, results) => {

      }
    );
  });

};

export const del_pick = () => {
  return db.transaction(function (tx) {
    tx.executeSql(
      'DELETE FROM pickup',
      [],
      (tx, results) => {


      }
    );
  });
};

export const all_drop = () => {
  query = "SELECT * FROM drop";
  return new Promise((resolve, reject) => db.transaction((tx) => {
    tx.executeSql(query, [], (tx, results) => {
      resolve(results);
    }, function (tx, error) {
      reject(error);
    });
  }));
};


export const insert_drop = (data) => {
  return db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO drop (json) VALUES (?)',
      [JSON.stringify(data)],
      (tx, results) => {

      }
    );
  });

};

export const del_drop = () => {
  return db.transaction(function (tx) {
    tx.executeSql(
      'DELETE FROM drop',
      [],
      (tx, results) => {


      }
    );
  });
};