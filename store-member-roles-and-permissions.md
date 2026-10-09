# Store Member Roles and Permissions

This document outlines all available roles and their associated permissions in the store management system.

## Roles Overview

The system supports three main roles:
- **Store Owner** - Full access to all store operations
- **Store Manager** - Day-to-day operations management (limited settings access)
- **Support Agent** - Read-only access for customer support

---

## Store Owner

**Role Code:** `STORE_OWNER`  
**Hierarchy Level:** 3 (Highest)  
**Description:** Full administrative access to all store operations and settings.

### Permissions

#### Store Management
- `store.manage` - Manage store operations
- `store.settings` - Manage store settings

#### Product Management
- `products.create` - Create products
- `products.read` - View products
- `products.update` - Update products
- `products.delete` - Delete products
- `products.pricing` - Modify product prices

#### Inventory Management
- `inventory.manage` - Manage inventory

#### Order Management
- `orders.manage` - Manage orders

#### Customer Management
- `customers.manage` - Manage customers

#### Analytics
- `analytics.view` - View analytics

#### Team Management
- `members.invite` - Invite team members
- `members.manage` - Manage team members
- `members.remove` - Remove team members

#### Content Management
- `policies.manage` - Manage store policies
- `coupons.manage` - Manage coupons
- `reviews.manage` - Manage reviews

---

## Store Manager

**Role Code:** `STORE_MANAGER`  
**Hierarchy Level:** 2 (Medium)  
**Description:** Day-to-day operations management with limited settings access. Cannot modify critical store settings or manage team members.

### Permissions

#### Store Management
- `store.manage` - Manage store operations
- ❌ `store.settings` - **NOT ALLOWED** (Cannot modify store settings)

#### Product Management
- `products.create` - Create products
- `products.read` - View products
- `products.update` - Update products
- `products.pricing` - Modify product prices
- ❌ `products.delete` - **NOT ALLOWED** (Cannot delete products)

#### Inventory Management
- `inventory.manage` - Manage inventory

#### Order Management
- `orders.manage` - Manage orders

#### Customer Management
- `customers.manage` - Manage customers

#### Analytics
- `analytics.view` - View analytics

#### Team Management
- `members.invite` - Invite team members
- ❌ `members.manage` - **NOT ALLOWED** (Cannot manage team members)
- ❌ `members.remove` - **NOT ALLOWED** (Cannot remove team members)

#### Content Management
- `policies.manage` - Manage store policies
- `coupons.manage` - Manage coupons
- `reviews.manage` - Manage reviews

---

## Support Agent

**Role Code:** `SUPPORT_AGENT`  
**Hierarchy Level:** 1 (Lowest)  
**Description:** Read-only access for customer support purposes. Limited to viewing data only.

### Permissions

#### Product Management
- `products.read` - View products
- ❌ `products.create` - **NOT ALLOWED**
- ❌ `products.update` - **NOT ALLOWED**
- ❌ `products.delete` - **NOT ALLOWED**
- ❌ `products.pricing` - **NOT ALLOWED**

#### Order Management
- `orders.read` - View orders (read-only)
- ❌ `orders.manage` - **NOT ALLOWED**

#### Customer Management
- `customers.read` - View customers (read-only)
- ❌ `customers.manage` - **NOT ALLOWED**

#### Reviews
- `reviews.read` - View reviews (read-only)
- ❌ `reviews.manage` - **NOT ALLOWED**

#### Support
- `support.access` - Access support features

#### Other Permissions
- ❌ All other permissions are **NOT ALLOWED**

---

## Permission Categories

### Store Management
- `store.manage` - Manage store operations
- `store.settings` - Manage store settings

### Product Management
- `products.create` - Create products
- `products.read` - View products
- `products.update` - Update products
- `products.delete` - Delete products
- `products.pricing` - Modify product prices

### Inventory Management
- `inventory.manage` - Manage inventory

### Order Management
- `orders.manage` - Manage orders
- `orders.read` - View orders (read-only)

### Customer Management
- `customers.manage` - Manage customers
- `customers.read` - View customers (read-only)

### Analytics
- `analytics.view` - View analytics

### Team Management
- `members.invite` - Invite team members
- `members.manage` - Manage team members
- `members.remove` - Remove team members

### Content Management
- `policies.manage` - Manage store policies
- `coupons.manage` - Manage coupons
- `reviews.manage` - Manage reviews
- `reviews.read` - View reviews (read-only)

### Support
- `support.access` - Access support features

---

## Role Hierarchy

The system uses a hierarchy-based permission model where higher-level roles can manage lower-level roles:

| Role | Hierarchy Level | Can Manage |
|------|----------------|------------|
| Store Owner | 3 | Store Manager, Support Agent |
| Store Manager | 2 | Support Agent |
| Support Agent | 1 | None |

### Rules
- A role can only manage roles with a lower hierarchy level
- A role cannot manage itself or roles at the same level
- Store Owner has the highest level and can manage all other roles
- Support Agent has the lowest level and cannot manage any roles

---

## Permission Comparison Matrix

| Permission | Store Owner | Store Manager | Support Agent |
|------------|-------------|---------------|---------------|
| `store.manage` | ✅ | ✅ | ❌ |
| `store.settings` | ✅ | ❌ | ❌ |
| `products.create` | ✅ | ✅ | ❌ |
| `products.read` | ✅ | ✅ | ✅ |
| `products.update` | ✅ | ✅ | ❌ |
| `products.delete` | ✅ | ❌ | ❌ |
| `products.pricing` | ✅ | ✅ | ❌ |
| `inventory.manage` | ✅ | ✅ | ❌ |
| `orders.manage` | ✅ | ✅ | ❌ |
| `orders.read` | ✅ | ✅ | ✅ |
| `customers.manage` | ✅ | ✅ | ❌ |
| `customers.read` | ✅ | ✅ | ✅ |
| `analytics.view` | ✅ | ✅ | ❌ |
| `members.invite` | ✅ | ✅ | ❌ |
| `members.manage` | ✅ | ❌ | ❌ |
| `members.remove` | ✅ | ❌ | ❌ |
| `policies.manage` | ✅ | ✅ | ❌ |
| `coupons.manage` | ✅ | ✅ | ❌ |
| `reviews.manage` | ✅ | ✅ | ❌ |
| `reviews.read` | ✅ | ✅ | ✅ |
| `support.access` | ✅ | ✅ | ✅ |

---

## Key Differences

### Store Owner vs Store Manager
- **Store Owner** can modify store settings (`store.settings`), delete products, and manage team members
- **Store Manager** cannot modify store settings, delete products, or manage team members

### Store Manager vs Support Agent
- **Store Manager** can create, update, and manage products, orders, and customers
- **Support Agent** can only view (read-only) products, orders, customers, and reviews

---

## Implementation Notes

- Permissions are defined in `app/Enums/StoreMemberRole.php`
- Permission checking is handled by `app/Services/StoreMemberPermissionService.php`
- The system also checks if a user is the store owner via `Store.user_id` as a fallback
- All permission checks should use the `StoreMemberPermissionService` for consistency

---

## References

- `app/Enums/StoreMemberRole.php` - Role definitions and permissions
- `app/Services/StoreMemberPermissionService.php` - Permission service
- `app/Models/StoreMember.php` - Store member model
- `app/Services/StoreMemberService.php` - Store member service

