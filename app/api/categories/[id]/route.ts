import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// GET /api/categories/[id] - Get Single Category
// ============================================================
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;

    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Error in GET /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT /api/categories/[id] - Update Category
// ============================================================
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;
    const body = await request.json();

    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    if (!body.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug if name changed
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug conflicts with other categories
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .neq('id', categoryId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Another category with this name already exists' },
        { status: 409 }
      );
    }

    // Update category
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        name: body.name,
        slug: slug,
        icon: body.icon,
        description: body.description,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        { error: 'Failed to update category', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error: any) {
    console.error('Error in PUT /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/categories/[id] - Delete Category
// ============================================================
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await context.params;

    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', categoryId)
      .single();

    if (checkError || !existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has products
    const { data: products, error: productCheckError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1);

    if (productCheckError) {
      console.error('Error checking products:', productCheckError);
      return NextResponse.json(
        { error: 'Failed to check category usage' },
        { status: 500 }
      );
    }

    // If category has products, soft delete (set is_active = false)
    if (products && products.length > 0) {
      const { error: softDeleteError } = await supabase
        .from('categories')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', categoryId);

      if (softDeleteError) {
        console.error('Error soft deleting category:', softDeleteError);
        return NextResponse.json(
          { error: 'Failed to delete category' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Category deactivated (has products)',
        categoryName: existingCategory.name,
        type: 'soft_delete',
      });
    }

    // If category has no products, hard delete
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (deleteError) {
      console.error('Error deleting category:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete category', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Category deleted successfully',
      categoryName: existingCategory.name,
      type: 'hard_delete',
    });
  } catch (error: any) {
    console.error('Error in DELETE /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
