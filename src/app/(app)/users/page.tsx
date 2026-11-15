'use client'

import { ApiResponse, Role, User } from '@/types/types'
import { useEffect, useState } from 'react'
import CustomTable, { features } from '../comp/CustomTable'
import { Button } from '@/components/ui/button'
import Model from '../comp/Model'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Container from '../comp/Container'
import Section from '../comp/Section'
import PageHeader from '../comp/Header'
import { Eye, EyeOff } from 'lucide-react'
import { CustomSelect } from '../comp/CustomSelect'
import { toast } from 'sonner'
import { createColumnHelper } from '@tanstack/react-table'


const emptyForm = { name: '', email: '', password: '', role: 'USER' as Role }

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editUser, setEditUser] = useState<User | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [showPass, setShowPass] = useState(false);

    async function fetchUsers() {
        setLoading(true)
        const res = await fetch('/api/users')
        const data = await res.json()
        setUsers(data)
        setLoading(false)
    }

    useEffect(() => { fetchUsers() }, [])

    function openAdd() {
        setEditUser(null)
        setForm(emptyForm)
        setError('')
        setShowModal(true)
    }

    function openEdit(user: User) {
        setEditUser(user)
        setForm({ name: user.name, email: user.email, password: user.password, role: user.role })
        setError('')
        setShowModal(true)
    }

    function closeModal() {
        setShowModal(false)
        setError('')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        const url = editUser ? `/api/users/${editUser.id}` : '/api/users'
        const method = editUser ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })

        const result = await res.json() as ApiResponse<User>
        setSubmitting(false)

        if (!res.ok) {
            setError(result.message || 'Something went wrong')
            return
        }

        if (result.success) {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
        closeModal()
        fetchUsers()
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this user?')) return
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
        const result = await res.json() as ApiResponse<null>
        if (result.success) {
            toast.success(result.message)
            await fetchUsers()
        } else {
            toast.error(result.message)
        }

    }

    const columnHelper = createColumnHelper<typeof features, User>()

    const columns = [
        columnHelper.accessor(
            'name', {
            header: 'Name',
            meta: {
                className: 'w-[550px]'
            }
        }
        ),
        columnHelper.accessor(
            'email', {
            header: 'Email',
            meta: {
                className: ''
            }
        }
        ),
        columnHelper.accessor(
            'role', {
            header: "Role",
            meta: {
                className: ''
            }
        }
        ),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',

            cell: ({ row }) => {
                const user: User = row.original as User;
                return (
                    <div className='flex gap-2 items-center'>
                        <Button variant={'secondary'} onClick={() => openEdit(user)}>Edit</Button>
                        <Button variant={'destructive'} onClick={() => handleDelete(user.id)}>Delete</Button>
                    </div>
                )
            },
            meta: {
                className: ''
            }
        })

    ]

    return (
        <div>
            <PageHeader header='Users' subheader='Manage all users'>
                <Button
                    variant={'primary'}
                    onClick={openAdd}
                >
                    Add User
                </Button>
            </PageHeader>

            <Container>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Section>
                        <div className=' rounded-lg shadow shadow-black/50 bg-textWhite'>
                            <CustomTable columns={columns} data={users} />
                        </div>
                    </Section>
                )}
                <Model title={editUser ? 'Edit User' : 'Add User'} onClose={() => setShowModal(false)} open={showModal}>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label >Email</Label>
                            <Input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label >Password</Label>
                            <div className='relative'>
                                <Input
                                    type={showPass ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <div onClick={() => setShowPass(!showPass)} className='absolute -translate-y-1/2 right-2 top-1/2'>
                                    {showPass ? <EyeOff className='text-textBlack/45' size={20} /> : <Eye className='text-textBlack/45' size={20} />}
                                </div>
                            </div>
                        </div>
                        <CustomSelect onChange={(value) => setForm({ ...form, role: value || 'USER' })} title='Select Role' items={[
                            {
                                value: 'USER',
                                label: 'USER'
                            },
                            {
                                value: 'ADMIN',
                                label: 'ADMIN'
                            },
                        ]} />

                        <div className="flex justify-end space-x-2 pt-2">
                            <Button
                                type="button"
                                onClick={closeModal}
                                variant={'destructive'}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={'primary'}
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Model>
            </Container>
        </div>
    )
}