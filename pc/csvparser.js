document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("CRIME");
    const chargeCodeInput = document.getElementById("CHARGECODE"); // Add this line to get the charge code input element
    const datalist = document.getElementById("crimeautofill");
    const csvData = [];

    // Fetch and parse the CSV data
    Papa.parse("https://bakerdevan.github.io/pc/ChargeCodeCSV2023-8-13-PCGenerator.csv", {
        header: true, // Specify that the CSV has headers
        download: true,
        dynamicTyping: true,
        complete: function (results) {
            if (results.errors.length > 0) {
                console.error("CSV parsing errors:", results.errors);
            } else if (results.data.length > 0) {
                csvData.push(...results.data);
                input.addEventListener("input", function () {
                    const value = this.value.toUpperCase();
                    const matches = csvData.filter(row => row["LongDescription"].toUpperCase().includes(value));
                    datalist.innerHTML = "";
                    matches.forEach(match => {
                        const option = document.createElement("option");
                        option.value = match["LongDescription"];
                        datalist.appendChild(option);
                    });
                });

                // Handle the selection of an option
                input.addEventListener("change", function () {
                    const selectedCrime = this.value;
                    const matchingRow = csvData.find(row => row["LongDescription"] === selectedCrime);
                    if (matchingRow) {
                        let chargeCode = matchingRow["ChargeCode"];
                        const specialPhrase = "99.0"; // Replace with your special phrase
                        chargeCodeInput.value = chargeCode + specialPhrase; // Concatenate without a space
                    } else {
                        chargeCodeInput.value = ""; // Clear the charge code input if no match is found
                    }
                });
            } else {
                console.error("No data found in the CSV file.");
            }
        },
        error: function (error) {
            console.error("CSV parsing error:", error.message);
        },
    });
});
