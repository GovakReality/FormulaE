<script setup>

</script>

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col
        cols="auto"
      >  
        <v-card
        class="mx-auto g-card"
        color="teal-darken-4"
        variant="elevated"
        >
          <v-card-item>
            <div>
              <div class="text-overline mb-1">
                Tiitle
              </div>
              <div class="text-h6 mb-1">
                Headline
              </div>
              <div class="text-caption">Greyhound divisely hello coldly fonwderfully</div>
            </div>
          </v-card-item>

          <v-card-actions>
            <v-btn>
              Button
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.g-card{
  background: linear-gradient(45deg, rgba(7,55,29,1) 0%, rgba(2,101,54,1) 100%);
  
  width: 500px;

}
</style>