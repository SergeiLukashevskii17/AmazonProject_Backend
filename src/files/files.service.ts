import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as uuid from "uuid";

@Injectable()
export class FilesService {
  async createFile(file: any): Promise<string> {
    try {
      const fileName = uuid.v4() + ".jpg";
      const filePath = path.resolve(__dirname, "..", "static");
      console.log(__dirname);
      if (!fs.existsSync(filePath)) {
        // если по данному пути ничего не существует , то создаём папку
        fs.mkdirSync(filePath, { recursive: true }); // rec-  true , если какой-то папки в пути не встречается - она создаётся
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException("File writing error", HttpStatus.BAD_REQUEST);
    }
  }
}
