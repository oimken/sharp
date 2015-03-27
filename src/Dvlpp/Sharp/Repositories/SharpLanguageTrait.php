<?php namespace Dvlpp\Sharp\Repositories;

trait SharpLanguageTrait
{

    /**
     * Boot the scope.
     *
     * @return void
     */
    public static function bootSharpLanguageTrait()
    {
        static::addGlobalScope(new SharpLanguageScope);
    }

    /**
     * Get the name of the column for applying the scope.
     *
     * @return string
     */
    public function getSharpLanguageColumn()
    {
        return defined('static::LANGUAGE_COLUMN') ? static::LANGUAGE_COLUMN : 'lang';
    }

    /**
     * Get the fully qualified column name for applying the scope.
     *
     * @return string
     */
    public function getQualifiedSharpLanguageColumn()
    {
        return $this->getTable() . '.' . $this->getSharpLanguageColumn();
    }

    /**
     * Get the query builder without the scope applied.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public static function withAllLanguages()
    {
        return with(new static)->newQueryWithoutScope(new SharpLanguageScope);
    }
}