import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件路径（ES模块方式）
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, 'public', 'map.geojson')
const backupPath = `${filePath}.bak`

async function addGeometryIds() {
  try {
    // 读取文件内容
    const data = await fs.readFile(filePath, 'utf8')
    const geojson = JSON.parse(data)

    // 添加自增ID
    geojson.features.forEach((feature, index) => {
      feature.properties.id = index + 1 // ID从1开始递增
    })

    // 备份原文件
    await fs.copyFile(filePath, backupPath)

    // 写入修改后的数据
    await fs.writeFile(
      filePath,
      JSON.stringify(geojson, null, 2), // 保留缩进格式
      'utf8',
    )

    console.log(`✅ 成功处理：${geojson.features.length}个要素`)
    console.log(`📁 备份文件：${backupPath}`)
  } catch (err) {
    console.error('❌ 处理失败：', err.message)
  }
}

// 执行函数
addGeometryIds()
