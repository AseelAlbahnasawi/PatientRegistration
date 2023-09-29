const PatientRegistry = artifacts.require("PatientRegistry");

const catchRevert = require("./exceptionsHelpers.js").catchRevert;

contract("PatientRegistry", function (accounts) {
    const [doctor, patient1, patient2] = accounts;

    const patient1Name = "Takua Mokhamed";
    const patient1Age = 30;
    const patient1DentalInfo = "Toothache";

    const patient2Name = "Asil Ahmad";
    const patient2Age = 20;
    const patient2DentalInfo = "Teeth cleaning";

    let patientRegistry;

    beforeEach(async () => {
        patientRegistry = await PatientRegistry.new({ from: doctor });
    });

    it("should allow a doctor to register a new patient", async () => {
        await patientRegistry.registerPatient(patient1Name, patient1Age, patient1DentalInfo, { from: doctor });

        const patientInfo = await patientRegistry.patients(0);

        assert.equal(patientInfo.name, patient1Name, "Patient's name not set correctly");
        assert.equal(patientInfo.age.toNumber(), patient1Age, "Patient's age not set correctly");
        assert.equal(patientInfo.dentalInfo, patient1DentalInfo, "Patient's dental info not set correctly");
    });

    it("should allow a doctor to get a specific patient's information", async () => {
        await patientRegistry.registerPatient(patient1Name, patient1Age, patient1DentalInfo, { from: doctor });

        const patientInfo = await patientRegistry.getPatient(0);
        // console.log("Patient Info:", patientInfo);

        assert.equal(patientInfo['0'], patient1Name, "Patient's name not retrieved correctly");
        assert.equal(patientInfo['1'], patient1Age, "Patient's age not retrieved correctly");
        assert.equal(patientInfo['2'], patient1DentalInfo, "Patient's dental info not retrieved correctly");
    });

    it("should allow a doctor to get a list of all registered patient IDs", async () => {
        await patientRegistry.registerPatient(patient1Name, patient1Age, patient1DentalInfo, { from: doctor });
        await patientRegistry.registerPatient(patient2Name, patient2Age, patient2DentalInfo, { from: doctor });

        const allPatients = await patientRegistry.getAllPatients({ from: doctor });

        assert.equal(allPatients.length, 2, "Number of patients retrieved is incorrect");
        assert.equal(allPatients[0], 0, "Patient 1 ID not retrieved correctly");
        assert.equal(allPatients[1], 1, "Patient 2 ID not retrieved correctly");
    });

    it("should not allow a doctor to register the same patient twice", async () => {
        await patientRegistry.registerPatient(patient1Name, patient1Age, patient1DentalInfo, { from: doctor });

        await catchRevert(
            patientRegistry.registerPatient(patient1Name, patient1Age, patient1DentalInfo, { from: doctor })
        );
    });

    it("should not allow a non-doctor to register a patient", async () => {
        await catchRevert(
            patientRegistry.registerPatient(patient1Name, patient1Age, patient1DentalInfo, { from: patient1 })
        );
    });
});
