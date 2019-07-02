import assert from 'assert';
import { basename, sep } from 'path';
import OrderApp from '../src/order-app';
import { readFile } from '../src/output/utils';

describe('OrderApp', () => {
  const resourcesDir = `${__dirname}${sep}resources${sep}`;
  const parameters = [
    {inputFile: `${resourcesDir}simple_command.json`, outputFile: `${resourcesDir}sample_result.txt`},
    // 案例执行请每次执行一个，同步执行会造成usr对象的积分数据同步错误
    // {inputFile: `${resourcesDir}simple_command01.json`, outputFile: `${resourcesDir}sample_result01.txt`},
  ];

  parameters.forEach((param) => {
    it(`如果输入的文件为${basename(param.inputFile)}，当调用 OrderApp.checkout() 方法，则得到期望的结果${basename(param.outputFile)} 文件中的字符串`, async () => {
      const inputStr = await readFile(param.inputFile, 'utf8');
      const actualRepresentation = (new OrderApp()).checkout(inputStr);

      const expectedResult = await readFile(param.outputFile, 'utf8');
      assert.equal(actualRepresentation.replace(/\r\n/gi, '\n'), expectedResult.trim().replace(/\r\n/gi, '\n'));
    });
  });
});
