"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({ path: '.env' });
const port = Number(process.env.PORT) || 4003;
app_1.default.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});
