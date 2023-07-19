// display recently added bag review
function fetchRecentlyAddedData() {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT tas.Id_Tas, tas.namaTas, tas.Foto, account.Username, merk.Nama_Merk, designer.Nama_Designer
        FROM tas
        INNER JOIN review ON tas.Id_Tas = review.Id_Tas
        INNER JOIN account ON review.Id_Account = account.Id_Account
        INNER JOIN merk ON merk.Id_Merk = tas.Id_Merk
        INNER JOIN designer ON designer.Id_Designer = tas.Id_Designer
        ORDER BY review.Tanggal_Review DESC
        LIMIT 3
      `;

        pool.query(query, (error, results) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

export { fetchRecentlyAddedData };