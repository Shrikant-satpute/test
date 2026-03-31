import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import type { UsersData, LoginPayload } from '@/lib/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ca-mock-test-secret-key-change-in-production'
);

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const usersRaw = fs.readFileSync(usersPath, 'utf-8');
    const usersData: UsersData = JSON.parse(usersRaw);

    const user = usersData.users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ username: user.username, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(JWT_SECRET);

    return NextResponse.json({
      success: true,
      role: user.role,
      username: user.username,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
