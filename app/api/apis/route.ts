import { NextResponse } from 'next/server';
import { ApiItem } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'apis.json');

// Helper to read data from JSON file
function readData(): ApiItem[] {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

// Helper to write data to JSON file
function writeData(data: ApiItem[]) {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

export async function GET() {
  const apis = readData();
  return NextResponse.json(apis);
}

export async function POST(request: Request) {
  const body = await request.json();
  const apis = readData();
  
  const newApi: ApiItem = {
    ...body,
    id: Date.now().toString(),
    status: 'unknown',
  };
  
  apis.push(newApi);
  writeData(apis);
  
  return NextResponse.json(newApi);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const apis = readData();
  
  const index = apis.findIndex(a => a.id === body.id);
  if (index !== -1) {
    apis[index] = { ...apis[index], ...body };
    writeData(apis);
    return NextResponse.json(apis[index]);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  let apis = readData();
  apis = apis.filter(a => a.id !== id);
  writeData(apis);
  
  return NextResponse.json({ success: true });
}
