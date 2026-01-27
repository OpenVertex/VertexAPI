import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username === 'admin' && password === 'Abc123!@#') {
    // In a real app, you'd set a secure cookie/JWT here
    return NextResponse.json({ success: true, user: { name: '管理员' } });
  }

  return NextResponse.json({ success: false, message: '账号或密码错误' }, { status: 401 });
}
